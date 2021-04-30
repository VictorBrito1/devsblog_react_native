import React from 'react';
import { View } from 'react-native';
import { Header } from 'react-native-elements';
import { SliderBox } from 'react-native-image-slider-box';
import CardView from 'react-native-cardview';
import Icon from 'react-native-vector-icons/AntDesign';
import Share from '../../components/Share';
import SyncStorage from 'sync-storage';
import Toast from 'react-native-simple-toast';
import { getFeed, feedLiked, getImage, like, dislike } from '../../api';

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

const TOTAL_SLIDE_IMAGES = 3;

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

        getFeed(idFeed)
            .then((currentFeed) => {
                this.setState({ feed: currentFeed }, () => {
                    this.checkUserLiked();
                });
            })
            .catch((error) => {
                console.error(`Erro pegando detalhes do feed: ${error}`);
            });

    };

    showSlides = () => {
        const { feed } = this.state;
        let slides = [];

        for (let i = 0; i < TOTAL_SLIDE_IMAGES; i++) {
            if (feed.post.blobs[i].file) {
                slides = [...slides, getImage(feed.post.blobs[i].file)];
            }
        }

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

    checkUserLiked = () => {
        const { idFeed } = this.state;

        feedLiked(idFeed)
            .then((result) => {
                this.setState({ liked: (result.likes > 0) });
            })
            .catch((error) => {
                console.error(`Erro verificando se usuário deu like: ${error}`)
            });
    }

    componentDidMount = () => {
        this.loadFeed();
    };

    like = () => {
        const { idFeed } = this.state;
        
        like(idFeed)
            .then((result) => {
                if (result.situation === 'ok') {
                    this.loadFeed();
                    Toast.show('Obrigado pela sua avaliação!', Toast.LONG);
                } else {
                    Toast.show('Ocorreu um erro nessa operação. Tente novamente.', Toast.LONG);
                }
            })
            .catch((error) => {
                console.error(`Erro registrando like: ${error}`)
            });
    };

    dislike = () => {
        const { idFeed } = this.state;

        dislike(idFeed)
            .then((result) => {
                if (result.situation === 'ok') {
                    this.loadFeed();
                } else {
                    Toast.show('Ocorreu um erro nessa operação. Tente novamente.', Toast.LONG);
                }
            })
            .catch((error) => {
                console.error(`Erro removendo like: ${error}`)
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
                                <Avatar source={getImage(feed.author.avatar)}/>
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