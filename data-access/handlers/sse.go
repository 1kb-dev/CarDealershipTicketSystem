package handlers

import (
	"fmt"
	"net/http"
	"sync"
	"time"
)

var (
	sseMu      sync.Mutex
	sseClients = map[chan string]struct{}{}
)

func SSEHandler(w http.ResponseWriter, r *http.Request) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")

	msgCh := make(chan string, 8)

	sseMu.Lock()
	sseClients[msgCh] = struct{}{}
	sseMu.Unlock()

	defer func() {
		sseMu.Lock()
		delete(sseClients, msgCh)
		sseMu.Unlock()
		close(msgCh)
	}()

	fmt.Fprintf(w, "event: hello\ndata: connected\n\n")
	flusher.Flush()

	notify := r.Context().Done()
	keepAlive := time.NewTicker(15 * time.Second)
	defer keepAlive.Stop()

	for {
		select {
		case msg := <-msgCh:
			fmt.Fprintf(w, "event: update\ndata: %s\n\n", msg)
			flusher.Flush()
		case <-keepAlive.C:
			fmt.Fprint(w, ": ping\n\n")
			flusher.Flush()
		case <-notify:
			return
		}
	}
}

func BroadcastSSE(message string) {
	sseMu.Lock()
	defer sseMu.Unlock()
	for ch := range sseClients {
		select {
		case ch <- message:
		default:
		}
	}
}
