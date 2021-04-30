import SyncStorage from 'sync-storage';

const LOCAL_IP = '192.168.0.105';
const FEEDS_URL = `http://${LOCAL_IP}:5000/`;
const COMMENTS_URL = `http://${LOCAL_IP}:5001/`;
const LIKES_URL = `http://${LOCAL_IP}:5002/`;
const AUTHORS_URL = `http://${LOCAL_IP}:5003/`;
const FILES_URL = `http://${LOCAL_IP}:80/`;

export const accessUrl = async (url) => {
    let promise = null;

    try {
        const response = await fetch(url, {method: 'GET'});
        promise = response.ok ? Promise.resolve(response.json()) : Promise.reject(response);
    } catch (error) {
        promise = Promise.reject(error);
    }

    return promise;
}

export const getFeeds = async (page) => {
    return accessUrl(FEEDS_URL + `feeds/${page}`);
}

export const getFeed = async (feedId) => {
    return accessUrl(FEEDS_URL + `feed/${feedId}`);
}

export const getFeedsByPostTitle = async (postTitle, page) => {
    return accessUrl(FEEDS_URL + `feeds/search/${postTitle}/${page}`);
}

export const getFeedsByAuthor = async (authorId, page) => {
    return accessUrl(FEEDS_URL + `feeds/author/${authorId}/${page}`);
}

export const getAuthors = async () => {
    return accessUrl(AUTHORS_URL + 'authors');
}

export const feedLiked = async (feedId) => {
    let promise = null;
    const user = SyncStorage.get('user');

    if (user) {
        promise = accessUrl(`${LIKES_URL}liked/${user.account}/${feedId}`);
    }

    return promise;
}

export const like = async (feedId) => {
    let promise = null;
    const user = SyncStorage.get('user');

    if (user) {
        promise = accessUrl(`${LIKES_URL}like/${user.account}/${feedId}`);
    }

    return promise;
}

export const dislike = async (feedId) => {
    let promise = null;
    const user = SyncStorage.get('user');

    if (user) {
        promise = accessUrl(`${LIKES_URL}dislike/${user.account}/${feedId}`);
    }

    return promise;
}

export const getComments = async (feedId, page) => {
    return accessUrl(`${COMMENTS_URL}comments/${feedId}/${page}`);
}

export const addComment = async (feedId, text) => {
    let promise = null;
    const user = SyncStorage.get('user');

    if (user) {
        promise = accessUrl(`${COMMENTS_URL}comments/add/${feedId}/${user.name}/${user.account}/${text}`);
    }

    return promise;
}

export const removeComment = async (commentId) => {
    return accessUrl(`${COMMENTS_URL}comments/remove/${commentId}`);
}

export const getImage = (image) => {
    return { uri: FILES_URL + image}
}