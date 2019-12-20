import * as React from "react";
import {connect} from 'react-redux';
import {Layout} from "@ui-kitten/components";
import DashboardNavBar from "../components/DashboardNavBar";
import DashboardBottomNavigation from "../components/DashboardBottomNavigation";
import DashboardContent from "../components/DashboardContent";
import SettingsTab from "../components/SettingsTab";
import {changeSelectedTabAction} from "../redux/Reducer";

class DashboardPage extends React.Component {

    pageCheck = () => {
        if (this.props.selectedTab === 0) {
            return (
                <DashboardContent/>
            );
        } else if (this.props.selectedTab === 1) {
            return (
                <SettingsTab/>
            );
        }
    };

    render() {
        return (
            <Layout style={{flex: 1}}>
                <Layout style={{flex: 1, justifyContent: 'flex-start', maxHeight: 50}}>
                    <DashboardNavBar/>
                </Layout>

                <Layout style={{flex: 2}}>
                    {this.pageCheck()}
                </Layout>

                <Layout style={{flex: 3, justifyContent: 'flex-end', maxHeight: 50}}>
                    <DashboardBottomNavigation/>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => ({
    selectedTab: state.app.selectedTab,
});

const mapDispatchToProps = (dispatch) => ({
    changeSelectedTab: (selectedTab) => dispatch(changeSelectedTabAction(selectedTab))
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
