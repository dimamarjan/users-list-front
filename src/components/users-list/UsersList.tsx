import { MouseEvent, DragEvent, useState, FormEvent, useEffect } from 'react';
import { User } from '../../interfaces/user.interface';
import { api } from '../../utils/fetchUserList';

import style from './userList.module.scss';

export default function UsersList() {
    const [inputName, setInputName] = useState('');
    const [usersList, setUsersList] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<null | string>(null);

    const onSubmitmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            if (!inputName) return;
            let rank: number = 1;
            if (usersList?.length) {
                rank = usersList[usersList.length - 1].rank + 1;
            }
            const { id } = await api.createUser({ name: inputName, rank });
            setUsersList([...usersList, { id, name: inputName, rank }]);
            setInputName('');
        } catch (error) {
            console.log(error);
        }
    };

    const onDragStartHeandler = (e: DragEvent<HTMLLIElement>) => {
        const targetUserName = (e.target as HTMLElement).children[0].textContent;
        if (targetUserName) {
            setCurrentUser(targetUserName);
        }
    };

    const onDropHeandler = (e: DragEvent<HTMLLIElement>, user: User) => {
        e.preventDefault();
        let usersUpdateList: User[] = [];
        setUsersList(
            usersList.map((userItem) => {
                switch (userItem.name) {
                    case user.name:
                        const correntUserData = usersList.find((u) => u.name === currentUser);
                        usersUpdateList.push({ ...userItem, rank: correntUserData!.rank });
                        return { ...userItem, rank: correntUserData!.rank };
                    case currentUser:
                        usersUpdateList.push({ ...userItem, rank: user.rank });
                        return { ...userItem, rank: user.rank };
                    default:
                        return userItem;
                }
            })
        );
        if (usersUpdateList.length) api.updateUserList(usersUpdateList);
    };

    const onEditButton = (user: User) => {
        const newName = prompt('Enter new user name');
        if (newName) {
            setUsersList(
                usersList.map((userItem) => {
                    if (userItem.name === user.name) {
                        api.updateUserList([{ ...userItem, name: newName }]);
                        return { ...userItem, name: newName };
                    }
                    return userItem;
                })
            );
        }
    };

    const onDeleteButton = (e: MouseEvent<HTMLElement>, user: User) => {
        e.preventDefault();
        api.deleteUser(user.id!);
        setUsersList(usersList.filter((userItem) => userItem.name !== user.name));
    };

    const sortQuery = (a: User, b: User) => (a.rank > b.rank ? 1 : -1);

    useEffect(() => {
        api.getUsersList().then((usersData: User[] | undefined) => {
            if (usersData?.length) return setUsersList(usersData);
        });
    }, []);

    return (
        <>
            <div className={style.container}>
                <form className={style.form} onSubmit={onSubmitmitHandler}>
                    <input
                        className={style.input}
                        placeholder="name"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                    />
                    <button>add user</button>
                </form>
            </div>
            <div className={style.container}>
                <ul className={style.list}>
                    {usersList &&
                        usersList?.sort(sortQuery).map((user) => (
                            <li
                                className={style.item}
                                key={user.id}
                                onDragStart={onDragStartHeandler}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => onDropHeandler(e, user)}
                                draggable={true}
                            >
                                <span>{user.name}</span>
                                <button className={style.edit} onClick={() => onEditButton(user)}>
                                    EDIT
                                </button>
                                <button className={style.del} onClick={(e) => onDeleteButton(e, user)}>
                                    DEL
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </>
    );
}
