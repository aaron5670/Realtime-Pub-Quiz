import * as React from "react";
import {connect} from 'react-redux';
import {Text} from "@ui-kitten/components";

class SettingsTab extends React.Component {
    render() {
        return (
            <>
                <Text category={'h4'} style={{marginLeft: 8, marginTop: 10}}>Instellingen</Text>
                <Text category={'h6'} style={{marginLeft: 8, marginTop: 10}}>Hallo {this.props.username}</Text>
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    username: state.app.username,
});

export default connect(mapStateToProps)(SettingsTab);
