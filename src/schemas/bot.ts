import * as yup from 'yup'

import tags from '../../assets/botTags.json'

export default yup.object().shape({
    name: yup.string().required(),
    short: yup.string().required().min(1).max(200),
    long: yup.string().required().min(1).max(5000),
    tags: yup.array().required().oneOf(tags as any),
    owner_name: yup.string().required().max(100),
    owner_id: yup.string().required().max(50),
    bot_id: yup.string().required().max(50),
    invite: yup.string().required().max(200), // todo: URL regex check, must be app.revolt.chat valid invite)
    support: yup.string().max(200), // todo:  URL regex check, must be app.revolt.chat valid invite)
    prefix: yup.string().required().max(5),
    help: yup.string().required().max(25),
    library: yup.string().required().max(25),
    avatar: yup.string().required().url().max(500), // todo: URL regex check, must be *.revolt.chat/ - PNG or GIF
    vanity: yup.string().min(4).max(20)
})