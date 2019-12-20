import * as React from "react";
import {connect} from 'react-redux';
import {Text} from "@ui-kitten/components";
import RecentPlayedGames from "./GamesCarousel/RecentPlayedGames";

const DashboardContent = (props) => {

    console.log(props)
    console.log(props.userRole)

    const adminContent = () => {
        if (props.userRole === 'admin')
            return (
                <>
                    <Text category={'h3'} style={{marginLeft: 8, marginBottom: 15, marginTop: 15}}>Recent games</Text>
                    <RecentPlayedGames/>
                </>
            )
    };

    const userContent = () => {
        if (props.userRole === 'user')
            return (
            <>
                <Text category={'h3'} style={{marginLeft: 8, marginBottom: 15, marginTop: 15}}>Welcome user!</Text>
            </>
        )
    };

    return (
        <>
            {adminContent()}
            {userContent()}
        </>
    );
};

const mapStateToProps = (state) => ({
    userRole: state.app.userRole,
});

const mapDispatchToProps = (dispatch) => ({
    // mapDispatchToProps
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContent);
