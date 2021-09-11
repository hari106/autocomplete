import React from "react";
import UserProfiles from "./UserProfiles";
import Message from "./Message";
import debounce from "../helpers/debounce";
import { InitAndClearCache, FetchGitUsers, FStates } from "../helpers/fetcher";

import "../css/SearchBar.css";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userList: [], loading: false, queryText: "" };

    this.processState = this.processState.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
  }

  componentDidMount() {
    InitAndClearCache();
  }

  updateQuery(args) {
    //communicate with github API and get results
    const query = args.target.value;

    if (query.trim() === "") {
      this.setState({
        loading: false,
        userList: [],
      });
      return;
    } else {
      this.setState(
        {
          queryText: query,
          loading: true,
        },
        () => {
          FetchGitUsers(query, this.processState);
        }
      );
    }
  }

  processState(state, data) {
    switch (state) {
      case FStates.OK: //fill up user info
        this.setState({
          loading: false,
          userList: data,
        });
        break;

      case FStates.ERR:
        alert(data);
        this.setState({ loading: false });
        break;
    }
  }

  render() {
    let body = <h3>No results to display</h3>;

    let message =
      "Requests are limited to 10 per minute.";

    const {userList, queryText, loading} = this.state;

    if (userList.length > 0 && queryText.trim() !== "") {
      if (loading) {
        message = "Loading...";
        body = (
          <div id="suggest">
            <div className="loader"></div>
          </div>
        );
      } else {
        body = (
          <div id="suggest">
            <UserProfiles users={userList} />
          </div>
        );
      }
    }

    return (
      <div>
        <Message message={message} />
        <input
          type="text"
          id="search-bar"
          placeholder="Search for users..."
          onChange={debounce(this.updateQuery)}
        />
        {body}
      </div>
    );
  }
}

export default SearchBar;
