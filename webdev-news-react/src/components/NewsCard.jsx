import { useContext, useState } from 'react'
import { WebContext } from '../webContext'
import { UserContext } from '../userContext'


export default function NewsCard({ item, setModal, setuserInfo, setcurrentModal }) {
    const site = useContext(WebContext)
    const [likeList, setLikeList] = useState(item.users_liked) // To dynamically show likes without making another api call
    const { user } = useContext(UserContext)

    let headers = new Headers()
    headers.set('Authorization', 'Bearer ' + `${user.token}`)
    headers.set('Content-type', 'application/json')

    const addRemoveLike = async (id) => {
        fetch(`${site}api/post/like`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ "post_id": `${id}`})
        })
        .then(() => {
            let array = [...likeList]
            const index = likeList.indexOf(user.username)

            if (index > -1) {
                array.splice(index, 1)
            } else {
                array.push(user.username)
            }
            setLikeList(array)
        })
    }

    return (
        <li className="card">
            <a href={item.post_url} target="blank" rel="noopener noreferrer"> 
                <img src={item.post_image} />
            </a>
            <h3 className="card__title">{item.post_title}</h3>
            <p className="card__description">"{item.post_description}"</p>
            <p>{likeList.length}</p>
            <button className="btn--card" onClick={() => {
                setModal(true)
                setuserInfo({
                    userId: `${item.post_user_id}`, 
                    userImg: `${item.post_user_image}`
                })
                setcurrentModal('userInfo')
            }}>
            <div className="card__avatar">
                <img src={item.post_user_image} />
            </div>
                {item.post_user}
            </button>
            {user.token && <button onClick={() => addRemoveLike(item.id)}>
                {likeList.includes(user.username) ? 'Unlike' : 'Like'}
            </button>}
        </li>
    )
}
