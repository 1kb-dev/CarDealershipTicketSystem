interface TicketTableProps {
    priority_level: number,
    ticket_id: number,
    user_id: number,
    username: string,
}


const TicketTable = ({ user_id }: TicketTableProps) => {
    return (
        <div>flex_container
            <div>top_nav_bar
                <div>sort_by dropdown {all, yours, input field for user_id specific; unrelated to user_id interface attribute}</div>
                <div>create ticket; redirect to createticketformpage</div>
                <div>username; plain dynamic string, dropdown user option: logout; does nothing right now</div>
            </div>
            <table>table_container
                <tr>scrollable row if overflowing container
                    <td>pr; means priority, dont focus on this, just a placeholder static data for now</td>
                    <td>id; ticket_id</td>
                    <td>username; user_id used to get username</td>
                    <td>category; based on createticketformpage category; derived from db</td>
                    <td>subject; title of ticket from createticketformpage; derived from db</td>
                </tr>
            </table>
        </div>
    )
}

export default TicketTable
