import * as VK from 'vk-openapi';

export class Social {

    private APP_ID: number = 6034471

    constructor() {
        VK.init({ apiId: this.APP_ID })
    }

    public check() {
        return new Promise((resolve, reject) => {
            VK.Auth.getLoginStatus((res) => {
                if (res.session) {
                    resolve(res.session)
                } else {
                    reject(new Error('Not logged in, needs auth'))
                }
            })
        })
    }

    public auth() {
        return new Promise((resolve, reject) => {
            VK.Auth.login((res) => {
                if (res.session) {
                    resolve(res.session)
                } else {
                    reject(new Error('Error logging in'))
                }
            })
        })
    }

    public getUserInfo(id) {
        return new Promise((resolve, reject) => {
            const params = {
                user_ids: id,
                fields: 'first_name,last_name,photo_50'
            }

            VK.Api.call('users.get', params, (r) => {
                if (r.response) {
                    resolve(r.response[0])
                } else {
                    reject(new Error(`Cannot get user info\n${ JSON.stringify(r.error) }`))
                }
            })
        })
    }

    public getFriends(id: number, count: number) {
        return new Promise((resolve, reject) => {
            const params = {
                user_id: id,
                order: 'hints',
                // count: count,
                fields: 'first_name,last_name,photo_50'
            }

            VK.Api.call('friends.get', params, (r) => {
                if (r.response) {
                    resolve(r.response)
                } else {
                    reject(new Error(`Cannot get friends list\n${ JSON.stringify(r.error) }`))
                }
            })
        })
    }

    public countLikeActivity(ownerId: number, count: number = 20) {
        return new Promise((resolve, reject) => {
            let likes: number = 0
            const code = `return { "likes" :
                            (API.photos.get({ "owner_id": ${ ownerId },
                                               "album_id": "profile",
                                               "rev": 1, 
                                               "extended": 1,
                                               "count": ${ count } })@.likes)@.user_likes +
                            (API.wall.get({ "owner_id": ${ ownerId },
                                            "count": ${ count } })@.likes)@.user_likes
                            };`

            VK.Api.call('execute', { code: code }, (r) => {
                if (r.response) {
                    resolve(r.response.likes.reduce((pv, cv) => pv + cv, 0))
                } else {
                    reject(new Error(`Cannot get like activity for id ${ ownerId }`))
                }
            })
        })
    }

    public logout() {
        return new Promise((resolve, reject) => {
            VK.Auth.logout((result) => {
                resolve(result)
            })
        })
    }
}