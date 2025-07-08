import './App.css'
import { UsersList } from './components/UsersList'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SortBy, type User } from './types.d'

function App() {

  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const originalUsers = useRef<User[]>([])

  const paintTitle = !showColors ? 'Paint rows' : 'Unpaint rows'
  const sortingTatle = sorting === SortBy.NONE ? 'Sort By Country' : 'Without Sorting'

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const togleSortByCountry = () => {
    const sortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(sortingValue)
  }

  const handleDelete = (index: number) => {
    const filteredUsers = users.filter((user, userIndex) => userIndex !== index)
    setUsers(filteredUsers)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const filteredUsers = useMemo(() => {
    return filterCountry !== null && filterCountry.length > 0
      ? users.filter(user => {
        return user.location.country.toLowerCase().includes(filterCountry.toLocaleLowerCase())
      }) : users
  }, [users, filterCountry])

  const sortedUsers = useMemo(() => {

    if ( sorting === SortBy.NONE ) return filteredUsers

    const compareProperties: Record<string, (user: User) => string> = {
      [SortBy.COUNTRY]: user => user.location.country,
      [SortBy.NAME]: user => user.name.first,
      [SortBy.LAST]: user => user.name.last,
    }

    return [...filteredUsers].sort((a, b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b))
    })

  }, [filteredUsers, sorting])

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort)
  }

  useEffect(() => {
    fetch('https://randomuser.me/api?results=100')
      .then(response => response.json())
      .then(response => {
        setUsers(response.results)
        originalUsers.current = response.results
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  return (
    <>
      <h1>Users List</h1>
      <header>
        <button onClick={toggleColors}>
          {paintTitle}
        </button>
        <button onClick={togleSortByCountry}>
          {sortingTatle}
        </button>
        <button onClick={handleReset}>
          Reset users
        </button>
        <input
          type="text"
          placeholder='Filter by country...'
          onChange={(e) => {
            setFilterCountry(e.target.value)
          }} />
      </header>
      <main>
        <UsersList
          changeSorting={ handleChangeSort } 
          handleDelete={ handleDelete } 
          showColors={ showColors } 
          users={ sortedUsers } />
      </main>
    </>
  )
}

export default App
