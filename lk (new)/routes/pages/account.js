const express = require('express');
const router = express.Router();

const sha256 = require('js-sha256')
const speakeasy = require("speakeasy")

const user = require('../../modules/user')
const server = require('../../modules/server')

const { modeHandle } = require('../../modules/mysqlConnection')

router.get('/', (req, res, next) =>
{
    res.render('index', { pathname: '/account' })
})
router.get('/settings', (req, res, next) =>
{
    res.render('index', { pathname: '/account/settings' })
})


// post
router.post('/_get', (req, res) =>
{
    if(!req.body)return res.sendStatus(400)

    const account = user.getCookiesAuth(req.cookies)
    user.load(account, true).then(result =>
    {
        if(result === 'no')return res.send('remove_cookies')

        account.data = result
        get()
    })

    async function get()
    {
        const _result = {
            account: account.data
        }

        var results = await modeHandle.query(account.server, `select * from logs where userid = ${modeHandle.format(account.uid)}`)
        _result.logs = results

        res.send(JSON.stringify(_result))
    }
})
router.post('/_login', (req, res) =>
{
    if(!req.body)return res.sendStatus(400)

    req.body.password = sha256(req.body.password)
    user.load(req.body).then(result =>
    {
        if(typeof result === 'string') res.send(result)
        else res.send(JSON.stringify(result))
    })
})

router.post('/settings/_get', (req, res) =>
{
    if(!req.body)return res.sendStatus(400)

    const account = user.getCookiesAuth(req.cookies)
    user.load(account, true).then(result =>
    {
        if(result === 'no')return res.send('remove_cookies')

        account.data = result
        get()
    })

    async function get()
    {
        let result = await modeHandle.query(account.server, `select pGoogleAuth from players where pID = ${modeHandle.format(account.uid)}`)

        account.data.pGoogleAuth = result[0]['pGoogleAuth']
        account.data.pGoogleAuthCode = ''

        if(account.data.pGoogleAuth === 0) account.data.pGoogleAuthCode = speakeasy.generateSecret({ length: 10 }).base32
        res.send(JSON.stringify(account.data))
    }
})
router.post('/settings/_save', (req, res) =>
{
    if(!req.body)return res.sendStatus(400)

    const account = user.getCookiesAuth(req.cookies)
    user.load(account, true).then(result =>
    {
        if(result === 'no')return res.send('remove_cookies')

        account.data = result
        save()
    })

    async function save()
    {
        req.body.data = JSON.parse(req.body.data)

        switch(req.body.save)
        {
            case 'notf':
                account.data.siteSettings.notf = req.body.data
                await modeHandle.query(account.server, `update players set siteSettings = ${modeHandle.format(JSON.stringify(account.data.siteSettings))} where pID = ${modeHandle.format(account.uid)}`)
                break
        }
        res.send('')
    }
})
router.post('/settings/_addGoogleAuth', (req, res) =>
{
    if(!req.body)return res.sendStatus(400)

    const account = user.getCookiesAuth(req.cookies)
    user.load(account, true).then(result =>
    {
        if(result === 'no')return res.send('remove_cookies')

        account.data = result
        add()
    })

    async function add()
    {
        const
            value = req.body.value,
            token = req.body.token

        if(!value || value.length != 6
            || !token)return res.send('error')
        if(account.data.pGoogleAuthCode === 1)return res.send('')

        if(!speakeasy.totp.verify({
            secret: token,
            encoding: 'base32',
            token: value }))return res.send('invalid_code')

        modeHandle.query(account.server, `update players set pGoogleAuth = 1, pGoogleAuthCode = ${modeHandle.format(token)} where pID = ${modeHandle.format(account.data.pID)}`)

        server.sendCMD(account.server, 'player.googleAuth.set', `${account.data.pID};${token}`)
        user.sendNotf(account.server, account.data.pID, -1, 'Подключение Google Authenticator', 'На Ваш аккаунт успешно был подключен Google Authenticator')

        res.send('')
    }
})
router.post('/settings/_removeGoogleAuth', (req, res) =>
{
    if(!req.body)return res.sendStatus(400)

    const account = user.getCookiesAuth(req.cookies)
    user.load(account, true).then(result =>
    {
        if(result === 'no')return res.send('remove_cookies')

        account.data = result
        remove()
    })

    async function remove()
    {
        const value = req.body.value

        if(!value || value.length != 6)return res.send('error')
        if(account.data.pGoogleAuthCode === 0)return res.send('')

        if(!speakeasy.totp.verify({
            secret: account.data.pGoogleAuthCode,
            encoding: 'base32',
            token: value }))return res.send('invalid_code')

        modeHandle.query(account.server, `update players set pGoogleAuth = 0, pGoogleAuthCode = '-' where pID = ${modeHandle.format(account.data.pID)}`)

        server.sendCMD(account.server, 'player.googleAuth.remove', `${account.data.pID}`)
        user.sendNotf(account.server, account.data.pID, -1, 'Отключение Google Authenticator', 'На Вашем аккаунте успешно был отключен Google Authenticator')

        res.send('')
    }
})

router.post('/_clearnotf', (req, res) =>
{
    if(!req.body)return res.sendStatus(400)

    const account = user.getCookiesAuth(req.cookies)
    user.load(account, true).then(result =>
    {
        if(result === 'no')return res.send('remove_cookies')

        account.data = result
        clear()
    })

    async function clear()
    {
        await modeHandle.query(account.server, `delete from notf where notfAccount = ${modeHandle.format(account.uid)}`)
        return res.send('')
    }
})
router.post('/_readnotf', (req, res) =>
{
    if(!req.body)return res.sendStatus(400)

    const account = user.getCookiesAuth(req.cookies)
    user.load(account, true).then(result =>
    {
        if(result === 'no')return res.send('remove_cookies')

        account.data = result
        clear()
    })

    async function clear()
    {
        await modeHandle.query(account.server, `update notf set notfRead = 1 where notfAccount = ${modeHandle.format(account.uid)} and notfRead = 0`)
        return res.send('')
    }
})

router.post('/_changepass', (req, res) =>
{
    if(!req.body)return res.sendStatus(400)

    const account = user.getCookiesAuth(req.cookies)
    user.load(account, true).then(result =>
    {
        if(result === 'no')return res.send('remove_cookies')

        account.data = result
        change()
    })

    async function change()
    {
        const
            oldpass = req.body.oldpass,
            newpass = req.body.newpass

        if(oldpass === undefined || newpass === undefined
            || !oldpass.length || !newpass.length)return res.send('invalid_data')

        if(account.data.pPassword.toLowerCase() !== sha256(oldpass).toLowerCase())return res.send('invalid_old_pass')

        await modeHandle.query(account.server, `update players set pPassword = ${modeHandle.format(sha256(newpass).toUpperCase())} where pID = ${modeHandle.format(account.uid)}`)
        return res.send('')
    }
})


module.exports = router;
