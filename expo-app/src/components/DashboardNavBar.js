import React from 'react';
import {
    Icon,
    Layout,
    OverflowMenu,
    TopNavigation,
    TopNavigationAction,
} from "@ui-kitten/components";
import {withNavigation} from "react-navigation";
import {API_URL} from "../settings";

const MenuIcon = (style) => (
    <Icon {...style} name='more-vertical'/>
);

const LogoutIcon = (style) => (
    <Icon {...style} name='log-out'/>
);

class DashboardNavBar extends React.Component {

    state = {
        menuVisible: false,
    };

    menuData = [
        {title: 'Uitloggen', icon: LogoutIcon, style: {backgroundColor: '#151A30'}},
    ];

    onMenuActionPress = () => {
        const menuVisible = !this.state.menuVisible;
        this.setState({menuVisible});
    };

    onMenuItemSelect = (index) => {
        this.setState({menuVisible: false});
        if (index === 0) {
            this.logout();
        }
    };

    renderMenuAction = () => (
        <OverflowMenu
            visible={this.state.menuVisible}
            data={this.menuData}
            placement='bottom end'
            onSelect={this.onMenuItemSelect}
            onBackdropPress={this.onMenuActionPress}>
            <TopNavigationAction
                icon={MenuIcon}
                onPress={this.onMenuActionPress}
            />
        </OverflowMenu>
    );

    logout = async () => {
        const url = `${API_URL}/api/v2/auth/logout`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            mode: 'cors'
        });
        if (response.status === 200) {
            this.props.navigation.navigate('Login');
        }
    };

    render() {
        return (
            <Layout>
                <TopNavigation
                    title='Dashboard'
                    rightControls={this.renderMenuAction()}
                    style={{backgroundColor: '#1A2138'}}
                />
            </Layout>
        );
    }
}

export default withNavigation(DashboardNavBar);
