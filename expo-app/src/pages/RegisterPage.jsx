import React from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {Icon, Button, Input, Layout, Text} from "@ui-kitten/components";
import RegisterNavbar from "../components/RegisterNavBar";
import {changeUserStatusAction} from "../redux/Reducer";
import {API_URL} from "../settings";

class RegisterPage extends React.Component {

    state = {
        nameValue: '',
        usernameValue: '',
        passwordValue: '',
        secureTextEntry: true,
        usernameStatus: false,
        errorPassword: false,
        statusMessageUsername: '',
        errorMessagePassword: ''
    };

    onChangeName = (nameValue) => {
        this.setState({nameValue});
    };

    onChangeUsername = (usernameValue) => {
        this.setState({usernameValue});
    };

    onChangePassword = (passwordValue) => {
        this.setState({passwordValue});
    };

    onIconPress = () => {
        const secureTextEntry = !this.state.secureTextEntry;
        this.setState({secureTextEntry});
    };

    renderIcon = (style) => {
        const iconName = this.state.secureTextEntry ? 'eye-off' : 'eye';
        return (
            <Icon {...style} name={iconName}/>
        );
    };

    checkUsernameAvailability() {
        const url = `${API_URL}/api/v2/auth/register?usernameCheck=true`;
        let data = {
            username: this.state.usernameValue,
        };
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            mode: 'cors'
        };

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                    if (data.success) {
                        this.setState({
                            usernameStatus: 'success',
                            statusMessageUsername: 'Username is available!'
                        })
                    } else {
                        this.setState({
                            usernameStatus: 'danger',
                            statusMessageUsername: 'Username is already taken!'
                        })
                    }
                }
            ).catch(err => alert('Error: Server is properly offline...'));
    }

    registerButton() {
        let disabled = true;
        if (this.state.nameValue && this.state.usernameStatus === 'success' && this.state.passwordValue) {
            disabled = false;
        }
        return (
            <Button style={styles.registerButton}
                    disabled={disabled}
                    onPress={() => this.fetchRegister()}>
                Create account
            </Button>
        )
    }

    fetchRegister() {
        const url = `${API_URL}/api/v2/auth/register`;
        let data = {
            name: this.state.nameValue,
            username: this.state.usernameValue,
            password: this.state.passwordValue
        };
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            mode: 'cors'
        };

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                    if (data.success) {
                        this.props.changeUserStatus('registered');
                        this.props.navigation.navigate('Login');
                    }
                }
            ).catch(err => alert('Error: Server is properly offline...'));
    }

    render() {
        let usernameStatus = '';
        if (this.state.usernameStatus === 'success') {
            usernameStatus = 'success';
        } else if (this.state.usernameStatus === 'danger') {
            usernameStatus = 'danger';
        }

        return (
            <>
                <Layout style={{flex: 1}}>
                    <Layout style={{justifyContent: 'flex-start'}}>
                        <RegisterNavbar/>
                    </Layout>
                </Layout>
                <Layout style={{flex: 2}}>
                    <Layout style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Layout style={styles.formContainer}>
                            <Text category='h1' style={styles.title}>Register</Text>
                            <Input
                                style={styles.input}
                                label={"First name"}
                                value={this.state.nameValue}
                                onChangeText={this.onChangeName}
                                placeholder='First name'
                            />
                            <Input
                                style={styles.input}
                                label={"Username"}
                                value={this.state.usernameValue}
                                onChangeText={this.onChangeUsername}
                                onBlur={() => this.checkUsernameAvailability()}
                                placeholder='Username'
                                status={usernameStatus}
                                caption={this.state.statusMessageUsername ? this.state.statusMessageUsername : ''}
                                autoCapitalize='none'
                            />
                            <Input
                                style={styles.input}
                                label={"Password"}
                                value={this.state.passwordValue}
                                placeholder='Password'
                                icon={this.renderIcon}
                                secureTextEntry={this.state.secureTextEntry}
                                onIconPress={this.onIconPress}
                                onChangeText={this.onChangePassword}
                                status={this.state.errorPassword ? 'danger' : null}
                                caption={this.state.errorPassword ? this.state.errorMessagePassword : ''}
                                autoCapitalize='none'
                            />
                            {this.registerButton()}
                        </Layout>
                    </Layout>
                </Layout>
            </>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        width: '100%',
        marginBottom: 20,
        textAlign: 'left'
    },
    modalContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        paddingBottom: 15
    },
    registerButton: {
        width: '100%'
    },
    formContainer: {
        width: '95%'
    }
});

const mapStateToProps = (state) => ({
    userStatus: state.app.userStatus
});

const mapDispatchToProps = (dispatch) => ({
    changeUserStatus: (userStatus) => dispatch(changeUserStatusAction(userStatus))
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
