import '../scss/index.scss'

import { User } from './models/user'

import { Social } from './modules/social'
import { UI } from './modules/ui'
import { GFX } from './modules/gfx'

import { sleep } from './utlis/sleep'

const init = () => {

    const soc: Social = new Social()
    const ui: UI = new UI()

    let currentUser: User

    const onGotActivities = (friends: Array<User>) => {
        const gfx: GFX = new GFX(currentUser, friends)
        ui.setLoaderText('drawing\n ')
        // setTimeout(() => {
            ui.hide(ui.loader)
        // }, 1000)
    }

    async function onGotFriends(res: Array<User>) {
        let friends: Array<User> = res
        let calls: number = 0

        ui.setLoaderText(`processing\n${ calls }/${ friends.length }`)

        for (let f of friends) {
             ((friend) => {
                soc.countLikeActivity(friend.uid)
                    .then((count: number) => {
                        friend.activities = count
                        calls++
                        ui.setLoaderText(`processing\n${ calls }/${ friends.length }`)
                        if (calls > friends.length - 1) onGotActivities(friends.filter((f) => f.activities !== 0))
                    })
                    .catch((e) => console.log(e))
            })(f)
            await sleep(500)
        }
    }
    const onGotUserInfo = (res: User) => {
        currentUser = res

        ui.setLoaderText('loading friend list\n ')

        soc.getFriends(currentUser.uid, 1)
            .then(onGotFriends)
            .catch((e) => console.log(e))
    }
    const onAuthSuccess = ({ mid }: any) => {
        console.log('Logged in')

        ui.hide(ui.signInBtn)
        ui.show(ui.signOutBtn)
        ui.show(ui.loader)

        ui.setLoaderText('loading user info\n ')

        soc.getUserInfo(mid)
            .then(onGotUserInfo)
            .catch((e) => console.log(e))

    }
    const onAuthFailure = (error) => {
        console.log(error)
        ui.show(ui.signInBtn)
        ui.hide(ui.signOutBtn)
    }
    const onLogout = () => {
        ui.show(ui.signInBtn)
        ui.hide(ui.signOutBtn)
        ui.remove(document.querySelector('canvas'))
        console.log('Not logged in')
    }

    ui.signInBtn.addEventListener('click', () => {
        soc.auth()
            .then(onAuthSuccess)
            .catch(onAuthFailure)
    })
    ui.signOutBtn.addEventListener('click', () => {
        soc.logout()
            .then(onLogout)
    })

    soc.check()
        .then(onAuthSuccess)
        .catch(onLogout)
}

document.addEventListener('DOMContentLoaded', () => {
    init()
})