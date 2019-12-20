import React from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {Icon, Button, Input, Layout, Text} from "@ui-kitten/components";
import {changeUsernameAction, changeUserRoleAction, changeUserStatusAction} from "../redux/Reducer";
import {API_URL} from "../settings";

class LoginPage extends React.Component {

    state = {
        usernameValue: '',
        passwordValue: '',
        secureTextEntry: true,
        errorUsername: false,
        errorPassword: false,
        errorMessageUsername: '',
        errorMessagePassword: ''
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

    notification() {
        if (this.props.userStatus === 'registered') {
            return (
                <Text style={{width: '100%', color: '#24e506', marginLeft: '5%'}}>Succesvol geregistreerd</Text>
            )
        }
    }

    fetchLogin() {
        const url = `${API_URL}/api/v2/auth/login`;
        let data = {
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
                        this.setState({
                            usernameValue: '',
                            passwordValue: '',
                            secureTextEntry: true,
                            errorUsername: false,
                            errorPassword: false,
                            errorMessageUsername: '',
                            errorMessagePassword: ''
                        });
                        this.props.changeUsername(data.username);
                        this.props.changeUserStatus(null);
                        this.props.changeUserRole(data.admin ? 'admin' : 'user');
                        this.props.navigation.navigate('Dashboard');
                    } else {
                        if (data.errorMsg[0] === 'username-incorrect') {
                            this.setState({
                                errorUsername: true,
                                errorPassword: false,
                                errorMessageUsername: "Username doesn't exist.."
                            });
                        } else if (data.errorMsg[0] === 'password-incorrect') {
                            this.setState({
                                errorPassword: true,
                                errorUsername: false,
                                errorMessagePassword: 'Password is incorrect..'
                            });
                        }

                        this.setState({
                            passwordValue: '',
                            isInvalidInputValue: true
                        });
                    }
                }
            )
            .catch(err => {
                console.log(err)
                alert('Error: Server is properly offline...')
            });
    }

    render() {
        return (
            <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text category='h1' style={styles.title}>Login page</Text>
                {this.notification()}
                <Layout style={styles.formContainer}>
                    <Input
                        label={"Username"}
                        value={this.state.usernameValue}
                        onChangeText={this.onChangeUsername}
                        placeholder='Username'
                        status={this.state.errorUsername ? 'danger' : null}
                        caption={this.state.errorUsername ? this.state.errorMessageUsername : ''}
                        autoCapitalize='none'
                        style={styles.input}
                    />
                    <Input
                        value={this.state.passwordValue}
                        label={"Password"}
                        placeholder='Password'
                        icon={this.renderIcon}
                        secureTextEntry={this.state.secureTextEntry}
                        onIconPress={this.onIconPress}
                        onChangeText={this.onChangePassword}
                        status={this.state.errorPassword ? 'danger' : null}
                        caption={this.state.errorPassword ? this.state.errorMessagePassword : ''}
                        autoCapitalize='none'
                        style={styles.input}
                    />
                    <Button style={styles.loginButton}
                            status='warning'
                            disabled={!(this.state.usernameValue && this.state.passwordValue)}
                            onPress={() => this.fetchLogin()}>
                        Login
                    </Button>

                    <Button style={styles.registerButton}
                            appearance='ghost'
                            status='primary'
                            onPress={() => this.props.navigation.navigate('Register')}>
                        Register
                    </Button>

                </Layout>
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        width: '100%',
        marginLeft: 15,
        marginBottom: 20,
        textAlign: 'left'
    },
    registerButton: {
        marginTop: 30
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
    loginButton: {
        width: '100%'
    },
    formContainer: {
        width: '95%'
    }
});

const mapStateToProps = (state) => ({
    username: state.app.username,
    userRole: state.app.userRole,
    userStatus: state.app.userStatus
});

const mapDispatchToProps = (dispatch) => ({
    changeUsername: (username) => dispatch(changeUsernameAction(username)),
    changeUserRole: (userRole) => dispatch(changeUserRoleAction(userRole)),
    changeUserStatus: (userStatus) => dispatch(changeUserStatusAction(userStatus))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
