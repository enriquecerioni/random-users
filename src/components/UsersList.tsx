import { SortBy, type User } from "../types.d"

interface Props {
    changeSorting: (sort: SortBy) => void
    handleDelete: (index: number) => void
    showColors: boolean
    users: User[]
}

export function UsersList({ changeSorting, handleDelete, showColors, users }: Props) {
    return (
        <table width='100%'>
            <thead>
              <th>Photo</th>  
              <th className="pointer" onClick={ () => changeSorting(SortBy.NAME) }>Name</th>  
              <th className="pointer" onClick={ () => changeSorting(SortBy.LAST) }>Lastname</th>  
              <th className="pointer" onClick={ () => changeSorting(SortBy.COUNTRY) }>Country</th>  
              <th>Actions</th>  
            </thead>
            <tbody>
                {
                    users.map((user, index) => {
                        const backgroundColor = index % 2 === 0 ? '#333' : '#555'
                        const color = showColors ? backgroundColor : 'transparent'

                        return (
                            <tr key={user.login.uuid} style={{ backgroundColor: color }}>
                                <td>
                                    <img src={user.picture.thumbnail} />
                                </td>
                                <td>
                                    { user.name.first }
                                </td>
                                <td>
                                    { user.name.last }
                                </td>
                                <td>
                                    { user.location.country }
                                </td>
                                <td>
                                    <button onClick={ () => 
                                        handleDelete(index) 
                                        }>Delete
                                    </button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}