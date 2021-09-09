import React from "react";
import '../css/UserProfiles.css';

class UserProfiles extends React.Component {
    render() {
        return (
            this.props.users.map(user => {
                return (
                    <div className="user-profile" key={user['id']}>
                        <div className="profile">
                            <h4>{user['login']}</h4>
                            <a href={user['html_url']}>{user['html_url']}</a>
                        </div>
                    </div>
                )
            })
            
        );
    }

}

export default UserProfiles;