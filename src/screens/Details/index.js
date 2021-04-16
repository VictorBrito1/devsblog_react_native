import React from 'react';
import staticFeeds from '../../assets/files/feeds.json';

import { View } from 'react-native';
import { Header } from 'react-native-elements';
import { SliderBox } from 'react-native-image-slider-box';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/AntDesign';
import Share from '../../components/Share';
import SyncStorage from 'sync-storage';
import Toast from 'react-native-simple-toast';

import slide1 from '../../assets/images/slide1.jpeg';
import slide2 from '../../assets/images/slide2.jpeg';
import slide3 from '../../assets/images/slide3.jpeg';
import avatar from '../../assets/images/avatar.jpeg';

import {
    Avatar,
    AuthorName,
    PostTitle,
    PostBody,
    Likes,
    Centralized,
    Spacer,
    LeftRow
} from '../../assets/styles';

export default class Details extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            idFeed: this.props.navigation.state.params.idFeed,
            feed: null,
            liked: false,
        }
    };

    loadFeed = () => {
        const { idFeed } = this.state;
        const filteredFeeds = staticFeeds.feeds.filter((feed) => feed._id === idFeed);

        if (filteredFeeds.length) {
            this.setState({ feed: filteredFeeds[0] });
        }
    };

    showSlides = () => {
        const slides = [ slide1, slide2, slide3 ];

        return (
            <SliderBox
                dotColor={'#ffad05'}
                inactiveDotColor={'#5995ed'}

                resizeMethod={'resize'}
                resizeMode={'cover'}

                dotStyle={{
                    width: 15,
                    height: 15,
                    borderRadius: 15,
                    marginHorizontal: 5
                }}

                images={slides} 
            />
        )
    };

    componentDidMount = () => {
        this.loadFeed();
    };

    like = () => {
        const { feed } = this.state;
        const user = SyncStorage.get('user');
        console.log('Adicionado like do usuario: ' + user.name);

        feed.likes++;

        this.setState({
            feed: feed,
            liked: true,
        }, () => {
            Toast.show('Obrigado pela sua avaliação!', Toast.LONG);
        });
    };

    dislike = () => {
        const { feed } = this.state;
        const user = SyncStorage.get('user');
        console.log('Removendo like do usuario: ' + user.name);

        feed.likes--;

        this.setState({
            feed: feed,
            liked: false,
        });
    };

    render = () => {
        const { feed, liked } = this.state;
        const user = SyncStorage.get('user');

        if (feed) {
            return (
                <>
                    <Header
                        leftComponent={
                            <Icon size={28} name="left" onPress={() => {
                                this.props.navigation.goBack();
                            }}/>
                        }

                        centerComponent={
                            <Centralized>
                                <Avatar source={avatar}/>
                                <AuthorName>{feed.author.name}</AuthorName>
                            </Centralized>
                        }

                        rightComponent={
                            <Centralized>
                               <Share feed={feed}/> 
                               <Spacer/>

                               {liked && user && <Icon name="heart" size={35} color={'#ff0000'} onPress={() => {
                                   this.dislike()
                               }}/>}

                               {!liked && user && <Icon name="hearto" size={35} color={'#ff0000'} onPress={() => {
                                   this.like()
                               }}/>}
                            </Centralized>
                        }
                    />

                    <CardView
                        cardElevation={2}
                        cornerRadius={2}
                    >
                        { this.showSlides() }

                        <View style={{ padding: 10 }}>
                            <Spacer/>

                            <PostTitle>{feed.post.title}</PostTitle>
                            <PostBody>{feed.post.body}</PostBody>

                            <Spacer/>

                            <LeftRow>
                                <Icon name="heart" size={25} color={'#ff0000'}>
                                    <Likes>  {feed.likes}</Likes>
                                </Icon>
                                
                                <Spacer/>

                                {user && <Icon name="message1" size={25} onPress={() => {
                                    this.props.navigation.navigate('Comments', {
                                        idFeed: feed._id,
                                        author: feed.author,
                                        post: feed.post
                                    });
                                }}/>}
                            </LeftRow>

                            <Spacer/>
                        </View>
                        
                    </CardView>
                </>
            );
        }

        return null;
    };
}