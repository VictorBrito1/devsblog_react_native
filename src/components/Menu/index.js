import React from 'react';

import { ScrollView, TouchableOpacity } from 'react-native';
import { LoginOptionsMenu } from '../../components/Login';
import Toast from 'react-native-simple-toast';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { getAuthors, getImage } from '../../api';
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
            filter: props.filter,

            authors: []
        };
    };

    componentDidMount = () => {
        getAuthors()
            .then((authors) => {
                this.setState({ authors: authors });
            })
            .catch((error) => {
                console.error(`Ocorreu um erro criando menu de empresas: ${error}`)
            });
    }

    showAuthor = (author) => {
        const { filter } = this.state;

        return(
            <TouchableOpacity onPress={() => {
                filter(author);
            }}>
                <LeftRow>
                    <Avatar source={getImage(author.avatar)}/>
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
        const { authors } = this.state;

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