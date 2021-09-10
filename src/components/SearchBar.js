import React from "react";
import UserProfiles from "./UserProfiles";
import debounce from "../helpers/debounce";
import { InitAndClearCache, FetchGitUsers, FStates } from "../helpers/fetcher";

import "../css/SearchBar.css";

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = { userList: [], loading: false, queryText: "" };

        this.queryResults = this.queryResults.bind(this);
    }

    componentDidMount() {
        InitAndClearCache();
    }

    queryResults(e) {
        //communicate with github API and get results
        const query = e.target.value;

        if (query.trim() === '') {
            this.setState({
                loading: false,
                userList: [],
            });
            return;
        }

        this.setState({
            queryText: query, 
            loading: true
        });
        
        FetchGitUsers(query, (state, data) => {
            switch (state) {
                case FStates.OK: //fill up user info
                    this.setState({
                        loading: false,
                        userList: data
                    });
                    break;

                case FStates.ERR:
                    alert(data);
                    this.setState({ loading: false });
                    break;
            }
        });
    }

    render() {

        let body = <h3>No results to display</h3>;

        if (this.state.userList.length > 0 && this.state.queryText.trim() !== '') {
            if (this.state.loading) {
                body = <div id="suggest"><div className="loader"></div></div>;
            } else {
                body = <div id="suggest"><UserProfiles users={this.state.userList} /></div>
            }

        }

        return (
            <div>
                <input type="text" id="search-bar" placeholder="Search for users..." onChange={debounce(this.queryResults)} />
                {body}
            </div>
        );
    }
}

export default SearchBar;