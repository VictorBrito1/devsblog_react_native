import React from 'react';

import { ScrollView, TouchableOpacity } from 'react-native';
import { LoginOptionsMenu } from '../../components/Login';
import Toast from 'react-native-simple-toast';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import avatar from '../../assets/images/avatar.jpeg';
import staticAuthors from '../../assets/files/authors.json';
import { 
    Avatar,
    AuthorName,
    ContainerMenu,
    LeftRow,
    MenuDivider,
} from '../../assets/styles';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            update: true,
            filter: props.filter
        };
    };

    showAuthor = (author) => {
        const { filter } = this.state;

        return(
            <TouchableOpacity onPress={() => {
                filter(author);
            }}>
                <LeftRow>
                    <Avatar source={avatar}/>
                    <AuthorName>{author.name}</AuthorName>
                </LeftRow>
                <MenuDivider/>
            </TouchableOpacity>
        )
    };

    onLogin = (user) => {
        this.setState({ update: true }, () => {
            Toast.show('Você foi logado com sucesso com sua conta ' + user.signer, Toast.LONG);
        });
    };

    onLogout = (signer) => {
        this.setState({ update: true }, () => {
            Toast.show('Você foi deslogado com sucesso de sua conta ' + signer, Toast.LONG);
        });
    };

    render = () => {
        const authors = staticAuthors.authors;

        return (
            <SafeAreaInsetsContext.Consumer>
                {insets => 
                    <ScrollView style={{ paddingTop: insets.top }}>
                        <LoginOptionsMenu onLogin={ this.onLogin } onLogout={ this.onLogout }/>
                        <ContainerMenu>
                            {authors.map((author) => this.showAuthor(author))}
                        </ContainerMenu>
                    </ScrollView>
                }
            </SafeAreaInsetsContext.Consumer>
        );
    };
}