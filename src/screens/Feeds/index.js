import React from 'react';
import staticFeeds from '../../assets/files/feeds.json';
import { SearchInput, Centralized, Spacer } from '../../assets/styles';

import { View, FlatList } from 'react-native';
import FeedCard from '../../components/FeedCard';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Menu from '../../components/Menu';
import DrawerLayout from 'react-native-drawer-layout';

const FEEDS_PER_PAGE = 4;

export default class Feeds extends React.Component {
    constructor(props) {
        super(props);

        this.filterByAuthor = this.filterByAuthor.bind(this);

        this.state = {
            nextPage: 0,
            feeds: [],
            postTitle: null,
            loading: false,
            updating: false,
            chosenAuthor: null,
        };
    };
    
    loadFeeds = () => {
        const { nextPage, feeds, postTitle, chosenAuthor } = this.state;

        this.setState({
            loading: true
        });

        if (chosenAuthor) {
            const moreFeeds = staticFeeds.feeds.filter((feed) => feed.author._id === chosenAuthor._id);

            this.setState({
                feeds: moreFeeds,
                loading: false,
                updating: false
            });
        } else if (postTitle) {
            const moreFeeds = staticFeeds.feeds.filter((feed) => 
                feed.post.title.toLowerCase().includes(postTitle.toLowerCase())
            );

            this.setState({
                feeds: moreFeeds,
                loading: false,
                updating: false
            });
        } else {
            const initialId = nextPage * FEEDS_PER_PAGE + 1;
            const endId = initialId + FEEDS_PER_PAGE - 1;
            const moreFeeds = staticFeeds.feeds.filter((feed) => feed._id >= initialId && feed._id <= endId);

            if (moreFeeds.length) {
                console.log('Adicionando ' + moreFeeds.length + ' feeds');

                this.setState({
                    nextPage: nextPage + 1,
                    feeds: [...feeds, ...moreFeeds],
                    loading: false,
                    updating: false
                });
            }
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
                        this.loadFeeds();
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
        this.setState({ updating: true, feeds: [], nextPage: 0, postTitle: null, chosenAuthor: null }, () => {
            this.loadFeeds();
        });
    };

    showFeed = (feed) => {
        return (
            <FeedCard feed={feed} navigator={this.props.navigation} />
        );
    };

    filterByAuthor = (author) => {
        this.setState({ chosenAuthor: author }, () => {
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