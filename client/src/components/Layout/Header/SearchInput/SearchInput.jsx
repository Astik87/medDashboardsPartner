import React, {useState} from "react"
import './style.css'
import searchIcon from './img/search.svg'
import searchLine from './img/line.svg'

const SearchInput = () => {

    const [searchText, setSearchText] = useState('')

    return (
        <div className="search">
            <div className="search-icon">
                <img src={searchIcon} alt="searchIcon"/>
            </div>
            <input className="search-input" placeholder="Поиск" type="text" value={searchText} onChange={e => setSearchText(e.target.value)}/>
            <div className="searchLine">
                <img src={searchLine} alt="searchLine"/>
            </div>
        </div>
    )
}

export default SearchInput
