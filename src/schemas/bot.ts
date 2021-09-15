import * as yup from 'yup'

import tags from '../../assets/botTags.json'

export default yup.object().shape({
    name: yup.string().required(),
    short: yup.string().required().min(1).max(200),
    long: yup.string().required().min(1).max(5000),
    tags: yup.array().required().oneOf(tags as any),
    owner_name: yup.string().required(),
    owner_id: yup.string().required(),
    bot_id: yup.string().required(),
    invite: yup.string().required(),
    support: yup.string(),
    prefix: yup.string().required(),
    help: yup.string().required(),
    library: yup.string().required(),
    avatar: yup.string().required().url(),
    vanity: yup.string()
})