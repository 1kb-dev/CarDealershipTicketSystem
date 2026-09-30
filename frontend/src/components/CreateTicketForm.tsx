import React from 'react'

interface CreateTicketFormProp{
    user_id: number,
}

const CreateTicketForm = ({user_id}: CreateTicketFormProp) => {
  return (
    <>
        <div>top_bar
            <div>version_int
                <p className="text-left">v0.1.0</p>
            </div>
        </div>
        <div>flexbox container
            <div className="flex [&>divjustify-center]">form_box
                <div>category</div>
                <div>platform</div>
                <div>subject</div>
                <div>issue</div>
            </div>
            <div>action_btns
                <div>clear</div>
                <div>submit</div>
            </div>
        </div>
    </>
  )
}

export default CreateTicketForm
