# Ticket Creator Explanation

## Big Picture

The current implementation separates responsibilities:

- `CreateTicketFormPage.tsx` manages the form and user interaction.
- `useTicketCreator.ts` manages the HTTP request.
- React state causes the UI to update.
- The component displays the hook's `error` and `isLoading` values.

The earlier approach directly searched the DOM with `document.querySelector`, read values with `FormData`, and logged them. That is more generic JavaScript, but it does not naturally integrate with React state or the component lifecycle.

## Form Component

```ts
import { useState, type ChangeEvent } from "react";
```

- `useState` is a React hook.
- It gives a component a value that React remembers between renders.
- `ChangeEvent` is a TypeScript type describing a form event.

```ts
const [category, setCategory] = useState(categories[0]);
```

This creates two things:

- `category`: the current value.
- `setCategory`: the function that changes it.

The same pattern is used for `platform`, `subject`, `issue`, and `submitted`.

When this runs:

```ts
setSubject(event.target.value);
```

React updates the state and renders the component again with the new value.

This differs from:

```ts
const formData = new FormData(form);
```

`FormData` reads the form only at the moment of submission. React state continuously tracks the input value while the user types.

```ts
const { createTicket, isLoading, error } = useTicketCreator({
  onSuccess: () => setSubmitted(true),
});
```

This calls the custom hook and receives three values:

- `createTicket`: the function that performs the HTTP request.
- `isLoading`: whether the request is currently running.
- `error`: an error message, if the request failed.

The `onSuccess` callback means: when the request succeeds, set `submitted` to `true`.

The hook does not need to know how the page should visually respond. It simply calls the callback.

## Form Submission

```ts
const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
```

This defines the function that runs when the form submits.

`FormEvent<HTMLFormElement>` would technically be a more precise type than `ChangeEvent<HTMLFormElement>`, because this is a submit event.

```ts
event.preventDefault();
```

Normally, submitting an HTML form reloads the page and navigates to the form action URL. This prevents the browser's default behavior so React can submit using `fetch` instead.

```ts
if (isLoading) return;
```

If a request is already in progress, another submit is ignored. This prevents duplicate ticket requests.

```ts
void createTicket({ user_id, category, platform, subject, issue });
```

This calls the hook's asynchronous function. The object becomes the JSON request body:

```json
{
  "user_id": 17,
  "category": "Technical issue",
  "platform": "Windows",
  "subject": "Cannot log in",
  "issue": "The login button does not respond."
}
```

`void` means: start this promise, but do not wait for its result inside this event handler. The hook handles success and failure itself.

## Rendering Errors

```tsx
{
  error && <div role="alert">{error}</div>;
}
```

This is JSX, not plain HTML. It means: if `error` contains a non-empty value, render the `<div>`.

If `error` is `null`, React renders nothing. If it contains a message, React renders that message inside the alert element.

`role="alert"` helps screen readers announce the error.

The success block works the same way:

```tsx
{
  submitted && <div role="status">Your ticket has been submitted.</div>;
}
```

It only renders after `setSubmitted(true)` runs.

## Controlled Inputs

For example:

```tsx
<input value={subject} onChange={(event) => setSubject(event.target.value)} />
```

This is called a controlled input.

The value displayed in the input comes from React:

```ts
value = { subject };
```

When the user types, this updates React state:

```ts
setSubject(event.target.value);
```

React then renders the new value.

The earlier generic approach let the browser own the input value and read it later using `FormData`. The current approach lets React own the value.

Neither approach is inherently wrong:

- `FormData` is simpler for generic, non-React forms.
- Controlled inputs are useful when the UI needs validation, disabling, clearing, conditional rendering, or live feedback.

## The Custom Hook

### Request URL

```ts
const CREATE_TICKET_URL = "/api/create-ticket";
```

This stores the request URL in one named constant.

### Response Type

```ts
export interface TicketDetails
```

This describes the ticket returned by the server.

### Request Type

```ts
export interface CreateTicketRequest
```

This describes the data required to create a ticket.

The request does not include server-generated fields such as `ticket_id` or `priority_level`.

### Hook Result Type

```ts
interface UseTicketCreatorResult {
  createTicket: (...) => Promise<TicketDetails | undefined>;
  isLoading: boolean;
  error: string | null;
}
```

This describes what the hook returns.

The important part is:

```ts
Promise<TicketDetails | undefined>;
```

That means the function is asynchronous:

- On success, it eventually returns a `TicketDetails` object.
- On failure, it eventually returns `undefined`.

## Why `useState` Is Used in the Hook

```ts
const [isLoading, setIsLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
```

The hook has its own React state.

Initially:

```ts
isLoading = false;
error = null;
```

When the request starts:

```ts
setIsLoading(true);
setError(null);
```

React re-renders the form:

- The submit button becomes disabled.
- The old error disappears.

When the request finishes:

```ts
setIsLoading(false);
```

React re-renders the form and enables the button again.

Without React state, changing a normal variable would not update the screen:

```ts
let isLoading = false;
isLoading = true;
```

React would not know that anything changed.

## Promises and `async`

```ts
const createTicket = async (
  ticket: CreateTicketRequest,
): Promise<TicketDetails | undefined> => {
```

`async` means this function always returns a promise.

A promise represents work that has not finished yet.

The request lifecycle is:

1. Start the function.
2. Set loading state.
3. Send the HTTP request.
4. Pause at `await fetch(...)`.
5. Resume when the server responds.
6. Process success or failure.
7. Turn loading off.

```ts
const response = await fetch(CREATE_TICKET_URL, {
```

`fetch` sends the HTTP request.

`await` pauses this function until `fetch` finishes. It does not freeze the browser; the UI can still render and respond.

```ts
method: "POST",
```

The request creates something, so it uses `POST`.

```ts
headers: { "Content-Type": "application/json" },
```

This tells the server that the request body contains JSON.

```ts
credentials: "include",
```

This tells the browser to include cookies with the request. This matters if authentication uses a session cookie or JWT cookie.

```ts
body: JSON.stringify(ticket),
```

JavaScript objects must be converted into JSON text before being sent over HTTP.

## Reading the Response

```ts
const data: ApiBody | null = await response.json().catch(() => null);
```

The response body is also asynchronous, so it uses `await`.

`response.json()` converts JSON text into a JavaScript object.

The `.catch(() => null)` handles responses that contain no valid JSON. If the server returns an empty body, `data` becomes `null` instead of causing another uncaught error.

## Handling HTTP Errors

```ts
if (!response.ok) {
  throw new Error(data?.message || "Unable to create the ticket.");
}
```

Important detail: `fetch` does not automatically throw for HTTP errors such as `400`, `401`, or `500`. It only rejects for network-level failures.

Therefore, the code manually checks:

```ts
response.ok;
```

If the status is successful, it is generally `true`. If the status is an error, it is `false`, and the code throws an error.

The `?.` in:

```ts
data?.message;
```

is optional chaining. It means: read `message` only if `data` is not null.

The `||` means: use the server's message if available; otherwise use the fallback message.

## Building the Result

```ts
const result: TicketDetails = {
```

This creates a consistently shaped ticket object for the rest of the frontend.

```ts
ticket_id: data?.ticket_id ?? 0,
```

The `??` operator means: use the left value unless it is `null` or `undefined`; otherwise use the right value.

The other fields use the server response when available, then fall back to the submitted request:

```ts
subject: data?.subject ?? ticket.subject,
```

This means:

- Prefer `data.subject` from the server.
- Otherwise use the original submitted subject.

## Success and Failure

```ts
onSuccess?.(result);
```

This calls the optional success callback if one was provided.

The `?.` means it is safe if no callback exists.

In the form, this becomes:

```ts
onSuccess: () => setSubmitted(true);
```

So a successful request displays the success message.

```ts
return result;
```

The hook also returns the created ticket to whoever calls `createTicket`.

## `try`, `catch`, and `finally`

```ts
try {
```

The code inside may fail because of:

- Network failure.
- Invalid JSON.
- A manually thrown HTTP error.
- An unexpected runtime error.

```ts
catch (err: unknown) {
```

This catches the error.

`unknown` is safer than `any` because TypeScript forces you to determine what kind of error it is before using it.

```ts
if (err instanceof TypeError) {
```

A `TypeError` commonly occurs when the browser cannot reach the server or `fetch` fails at the network level.

```ts
} else if (err instanceof Error) {
  setError(err.message);
}
```

If it is a normal JavaScript `Error`, display its message. This includes the error manually created for an unsuccessful HTTP response.

```ts
else {
  setError("Something went wrong. Try again.");
}
```

This handles unusual thrown values that are not standard `Error` objects.

```ts
return undefined;
```

The caller receives `undefined` on failure.

```ts
finally {
  setIsLoading(false);
}
```

`finally` always runs:

- After success.
- After an HTTP error.
- After a network error.

That guarantees the submit button is re-enabled.

## Comparison With the Earlier Approach

The earlier approach was roughly:

```ts
const form = document.querySelector("#ticket-form");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const subject = formData.get("subject");

  console.log(subject);
});
```

That approach is easier to understand initially because it follows normal browser behavior:

1. Find the form.
2. Listen for submit.
3. Read the form values.
4. Do something with them.

The current React approach adds more layers:

1. Each input has React state.
2. The component passes data into a custom hook.
3. The hook manages loading and errors.
4. The hook sends the request.
5. The hook calls a success callback.
6. React re-renders based on state.

The reason for the extra structure is reuse and UI synchronization. The same hook could later be used by another ticket form, modal, or admin screen without duplicating the HTTP logic.

The main conceptual split is:

```text
Component:
  What does the user see and interact with?

Hook:
  How does the application communicate with the server?
```

That separation is the main difference from the original generic DOM-based version.
