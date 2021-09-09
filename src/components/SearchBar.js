import React from "react";
import UserProfiles from "./UserProfiles";
import debounce from "../helpers/debounce";
import { FetchGitUsers, FStates } from "../helpers/fetcher";

import "../css/SearchBar.css";

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = { userList: [], loading: false, queryText: "" };

        this.queryResults = this.queryResults.bind(this);
    }

    queryResults(e) {
        //communicate with github API and get results
        const query = e.target.value;

        if (query.trim() === '') {
            return;
        }

        this.setState({
            queryText: query
        });
        this.setState({ loading: true });

        //use a timer to count number of requests and queue requests

        FetchGitUsers(query, (state, userlist) => {
            if (state === FStates.OK) {
                //fill up user info
                this.setState({
                    loading: false,
                    userList: userlist
                });
            }
            else if (state === FStates.ERR) {
                alert(state);
                this.setState({ loading: false });
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