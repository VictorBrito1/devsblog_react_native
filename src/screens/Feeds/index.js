import React from 'react';
import { SearchInput, Centralized, Spacer } from '../../assets/styles';

import { View, FlatList } from 'react-native';
import FeedCard from '../../components/FeedCard';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Menu from '../../components/Menu';
import DrawerLayout from 'react-native-drawer-layout';

import { getFeeds, getFeedsByPostTitle, getFeedsByAuthor } from '../../api';

export default class Feeds extends React.Component {
    constructor(props) {
        super(props);

        this.filterByAuthor = this.filterByAuthor.bind(this);

        this.state = {
            nextPage: 1,
            feeds: [],
            postTitle: null,
            loading: false,
            updating: false,
            chosenAuthor: null,
        };
    };

    showMoreFeeds = (moreFeeds) => {
        const { nextPage, feeds } = this.state;

        if (moreFeeds.length) {
            console.log(`Adicionando ${moreFeeds.length} feeds`);

            this.setState({
                nextPage: nextPage + 1,
                feeds: [...feeds, ...moreFeeds],
                loading: false,
                updating: false
            });
        } else {
            this.setState({
                loading: false,
                updating: false,
            });
        }
    };
    
    loadFeeds = () => {
        const { nextPage, postTitle, chosenAuthor } = this.state;

        this.setState({
            loading: true
        });

        if (chosenAuthor) {
            getFeedsByAuthor(chosenAuthor._id, nextPage)
                .then((moreFeeds) => {
                    this.showMoreFeeds(moreFeeds)
                })
                .catch((error) => {
                    console.error(`Erro acessando feeds por autor: ${error}`);
                });
        } else if (postTitle) {
            getFeedsByPostTitle(postTitle, nextPage)
                .then(moreFeeds => {
                    this.showMoreFeeds(moreFeeds);
                })
                .catch(error => {
                    console.error(`Erro acessando feeds pelo título: ${error}`);
                });
        } else {
            getFeeds(nextPage)
                .then(moreFeeds => {
                    this.showMoreFeeds(moreFeeds)
                })
                .catch(error => {
                    console.error(`Erro acessando feeds: ${error}`);
                });
        }
    };

    componentDidMount = () => {
        this.loadMoreFeeds();
    };

    loadMoreFeeds = () => {
        const { loading } = this.state;

        if (loading) {
            return;
        }

        this.loadFeeds();
    };

    updatePostTitle = (text) => {
        this.setState({
            postTitle: text
        });
    };

    showSearchBar = () => {
        const { postTitle } = this.state;

        return(
            <Centralized>
                <SearchInput onChangeText={(text) => { this.updatePostTitle(text) }} value={postTitle}/>

                <Icon 
                    style={{padding: 8}} 
                    size={25} name='search1'
                    onPress={() => {
                        this.setState({
                            nextPage: 1,
                            feeds: []
                        }, () => {
                            this.loadFeeds();
                        });
                    }}
                />
            </Centralized>
        )
    };

    showMenu = () => {
        this.menu.openDrawer();
    };

    showFeeds = (feeds) => {
        const { updating } = this.state;

        return (
            <DrawerLayout
                drawerWidth={250}
                drawerPosition={DrawerLayout.positions.Left}
                renderNavigationView={() => <Menu filter={this.filterByAuthor}/>}
                ref={drawerElement => { this.menu = drawerElement; }}
            >
                <Header
                    leftComponent={
                        <Icon style={{}} size={28} name='menuunfold' onPress={() => {
                            this.showMenu();
                        }}/>
                    }

                    centerComponent={
                        this.showSearchBar()
                    }
                >

                </Header>
                
                <FlatList
                    data={feeds}
                    numColumns={1}
                    keyExtractor={(item) => String(item._id)}

                    onEndReached={() => this.loadMoreFeeds()}
                    onEndReachedThreshold={0.1}

                    onRefresh={() => this.updateScreen()}
                    refreshing={updating}

                    renderItem={(item) => {
                        return (
                            <View style={{width: '100%'}}>
                                {this.showFeed(item)}
                                <Spacer/>
                            </View>
                        )
                    }}
                >

                </FlatList>
            </DrawerLayout>
        )
    };

    updateScreen = () => {
        this.setState({ updating: true, feeds: [], nextPage: 1, postTitle: null, chosenAuthor: null }, () => {
            this.loadFeeds();
        });
    };

    showFeed = (feed) => {
        return (
            <FeedCard feed={feed} navigator={this.props.navigation} />
        );
    };

    filterByAuthor = (author) => {
        this.setState({ chosenAuthor: author, nextPage: 1, feeds: [] }, () => {
            this.loadFeeds();
        });

        this.menu.closeDrawer();
    };

    render = () => {
        const { feeds } = this.state;

        if (feeds.length) {
            console.log('Exibindo ' + feeds.length + ' feeds.');

            return (this.showFeeds(feeds));
        }

        return null;
    }
};