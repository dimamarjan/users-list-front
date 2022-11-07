import axios from 'axios';
import { User } from '../interfaces/user.interface';

const { REACT_APP_SERVER_URL } = process.env;
axios.defaults.baseURL = REACT_APP_SERVER_URL;

const getUsersList = async () => {
    try {
        const { data } = await axios.get('/');
        return data;
    } catch (error) {
        console.log(error);
    }
};

const createUser = async (usersList: User) => {
    try {
        const { data } = await axios.post('/create', usersList);
        return data;
    } catch (error) {
        console.log(error);
    }
};

const updateUserList = async (usersList: User[]) => {
    try {
        const { data } = await axios.patch(`/update`, usersList);
        return data;
    } catch (error) {
        console.log(error);
    }
};

const deleteUser = async (userName: string) => {
    try {
        const { data } = await axios.delete(`/delete/${userName}`);
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const api = { getUsersList, createUser, updateUserList, deleteUser };
