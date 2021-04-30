import React from 'react';
import { FlatList, Text, Modal, TextInput, Alert, View } from 'react-native';
import { Header, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import SyncStorage from 'sync-storage';
import Swipeable from 'react-native-swipeable-row';
import Moment from 'react-moment';
import 'moment-timezone';
import { getComments, addComment, removeComment } from '../../api';
import {
    Spacer,
    Centralized,
    CommentDivider,
    ContainerComment,
    ContainerCurrentUserComment,
    ContainerOtherUserComment,
    CommentSpacer,
    ContainerNewComment,
    CommentAuthor,
    Comment,
    CommentDate,
    PostTitleComment
} from '../../assets/styles';

const COMMENT_MAX_SIZE = 100;

export default class Comments extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: [],
            updating: false,
            loading: false,
            nextPage: 1,

            displayedAddScreen: false,
            newCommentText: '',

            idFeed: this.props.navigation.state.params.idFeed,
            post: this.props.navigation.state.params.post,
            author: this.props.navigation.state.params.author,
        };
    };

    loadComments = () => {
        const { idFeed, comments, nextPage } = this.state;
        this.setState({loading: true});

        getComments(idFeed, nextPage)
            .then((moreComments) => {
                if (moreComments.length) {
                    this.setState({
                        nextPage: nextPage + 1,
                        comments: [...comments, ...moreComments],
                        updating: false,
                        loading: false
                    });
                } else {
                    this.setState({
                        updating: false,
                        loading: false
                    });
                }
            })
            .catch((error) => {
                console.error(`Erro exibindo comentários: ${error}`);
            });
    };

    componentDidMount = () => {
        this.loadComments();
    };

    confirmRemoveComment = (comment) => {
        Alert.alert(null, 'Tem certeza que deseja remover o seu comentário?',
            [
                { text: "SIM", onPress: () => this.removeComment(comment)},
                { text: "NÃO", style: 'cancel'}
            ]
        )
    };

    removeComment = (comment) => {
        removeComment(comment._id)
            .then((result) => {
                if (result.situation === 'ok') {
                    this.setState({ nextPage: 1, comments: []}, () => {
                        this.loadComments();
                    });
                }
            })
            .catch((error) => {
                console.error(`Erro removendo comentário: ${error}`);
            });
    };

    showCurrentUserComment = (comment) => {
        return (
            <>
                <Swipeable
                    rightButtonWidth={50}
                    rightButtons={[
                        <View style={{ padding: 15 }}>
                            <Spacer/>
                            <Icon name="delete" color="#030303" size={28} onPress={() => {
                                this.confirmRemoveComment(comment);
                            }}/>
                        </View>
                    ]}
                >
                    <ContainerCurrentUserComment>
                        <CommentAuthor>{'Você:'}</CommentAuthor>
                        <Comment>{comment.content}</Comment>
                        <CommentDate>
                            <Moment element={Text} parse="YYYY-MM-DD HH:mm" format="DD/MM/YYYY HH:mm">
                                {comment.datetime}
                            </Moment>
                        </CommentDate>
                    </ContainerCurrentUserComment>
                </Swipeable>
                <CommentSpacer/>
            </>
        );
    };

    showOtherUsersComment = (comment) => {
        return (
            <>
                <ContainerOtherUserComment>
                    <CommentAuthor>{comment.user.name}</CommentAuthor>
                    <Comment>{comment.content}</Comment>
                    <CommentDate>
                        <Moment element={Text} parse="YYYY-MM-DD HH:mm" format="DD/MM/YYYY HH:mm">
                            {comment.datetime}
                        </Moment>
                    </CommentDate>
                </ContainerOtherUserComment>
                <CommentSpacer/>
            </>
        );
    };

    loadMoreComments = () => {
        const { loading } = this.state;

        if (loading) {
            return;
        }

        this.loadComments();
    };

    updateScreen = () => {
        this.setState({ updating: true, loading: false, nextPage: 1, comments: []}, () => {
            this.loadComments();
        });
    };

    addComment = () => {
        const { idFeed, newCommentText } = this.state;

        addComment(idFeed, newCommentText)
            .then((result) => {
                if (result.situation === 'ok') {
                    this.setState({ nextPage: 1, comments: [] }, () => {
                        this.loadComments();
                    });
                }
            })
            .catch((error) => {
                console.error(`Erro adicionado comentário: ${error}`)
            });

        this.changeDisplayAddScreen();
    };

    changeDisplayAddScreen = () => {
        const { displayedAddScreen } = this.state;

        this.setState({ displayedAddScreen: !displayedAddScreen });
    };

    updateNewCommentText = (text) => {
        this.setState({ newCommentText: text });
    };

    showAddCommentScreen = () => {
        return (
            <Modal 
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    this.updateScreen();
                }}
            >
                <ContainerNewComment>
                    <TextInput 
                        multiline
                        editable
                        placeholder={"Digite um comentário"}
                        maxLength={COMMENT_MAX_SIZE}
                        onChangeText={(text) => {
                            this.updateNewCommentText(text);
                        }}
                    />

                    <CommentDivider />
                    <Spacer />

                    <Centralized>
                        <Button
                            icon={
                                <Icon name="check" size={22} color={"#fff"}/>
                            }
                            title="Salvar"
                            type="solid"
                            onPress={() => {
                                this.addComment();
                            }}
                        ></Button>

                        <Spacer/>

                        <Button
                            icon={
                                <Icon name="check" size={22} color={"#ff0000"}/>
                            }
                            title="Cancelar"
                            type="solid"
                            onPress={() => {
                                this.changeDisplayAddScreen();
                            }}
                        ></Button>
                    </Centralized>

                    <Spacer/>

                </ContainerNewComment>
            </Modal>
        );
    };

    showComments = () => {
        const { comments, updating, post } = this.state;
        const user = SyncStorage.get('user')

        return (
            <>
                <Header 
                    leftComponent={
                        <Icon name="left" size={28} onPress={() => {
                            this.props.navigation.goBack();
                        }}/>
                    }

                    centerComponent={
                        <Centralized>
                            <PostTitleComment>{post.title}</PostTitleComment>
                        </Centralized>
                    }

                    rightComponent={
                        <Icon name="pluscircleo" size={28} onPress={() => {
                            this.changeDisplayAddScreen();
                        }}/>
                    }
                />
                <ContainerComment>
                    <FlatList
                        data={comments}

                        onEndReached={() => {this.loadMoreComments();}}
                        onEndReachedThreshold={0.1}

                        onRefresh={() => {this.updateScreen()}}
                        refreshing={updating}

                        keyExtractor={(item) => String(item._id)}
                        renderItem={({item}) => {
                            if (item.user.email == user.account) {
                                return this.showCurrentUserComment(item);
                            } else {
                                return this.showOtherUsersComment(item);
                            }
                        }}
                    >
                    </FlatList>
                </ContainerComment>
            </>
        );
    };

    render = () => {
        const { comments, displayedAddScreen } = this.state;

        if (comments) {
            return(
                <>
                    {this.showComments()}
                    { displayedAddScreen && this.showAddCommentScreen() }
                </>
            );
        }

        return null;
    };
}