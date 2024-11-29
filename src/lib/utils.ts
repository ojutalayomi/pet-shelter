import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from 'js-cookie'
import moment from 'moment'
import { User } from "@/types/type";

export interface UserList {
	avatar: string;
	name: string;
	role: User['role'];
	username: string;
	token: string;
}

export type ResponseType = "countdown" | "getlivetime" | "chat-time";

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
	expires: 7,
	path: '/',
	...(isProduction 
		? {
			sameSite: 'None' as const,
			secure: true,
			domain: 'your-production-domain.com' // Set your production domain
		}
		: {
			sameSite: 'Lax' as const,
			secure: false
		}
	)
};

export const setCookie = ({ avatar, name, role, username, token }: UserList) => {
	// console.log('Setting cookie...');
	const storedUsers = JSON.parse(localStorage.getItem('users_list') || '[]') as UserList[];
	const user = storedUsers.find(user => user.username === username);
	if(user) {
		Cookies.set('pt_session', token, cookieOptions);
		return;
	}
	
	if(storedUsers.length < 5) {
		storedUsers.push({ avatar, name, role, username, token });
		
		Cookies.set('pt_session', token, cookieOptions);
		localStorage.setItem('users_list', JSON.stringify(storedUsers));
	} else {
		return ('User list is full. Cannot add more users. Limit is 4. Logout other users to add more.');
	}
	// console.log('Cookie set successfully!');
};

export const switchUser = (username: string) => {
	const storedUsers = JSON.parse(localStorage.getItem('users_list') || '[]') as UserList[];
	const user = storedUsers.find(user => user.username === username);
	if (user) {
		Cookies.set('pt_session', user.token, cookieOptions);
		return true;
	}
	return false;
}

export const logoutUser = async (username: string) => {
	const storedUsers = JSON.parse(localStorage.getItem('users_list') || '[]') as UserList[];
	const user = storedUsers.find(user => user.username === username);
	if (user) {
		if(Cookies.get('pt_session') === user.token) {
			Cookies.remove('pt_session', cookieOptions);
			const newStoredUsers = storedUsers.filter(user => user.username !== username);
			localStorage.setItem('users_list', JSON.stringify(newStoredUsers));
			if(storedUsers.length === 1) {
				return { status: true, message: 'User logged out successfully' };
			} else {
				return { status: true, message: 'User logged out successfully', otherUsers: true };
			}
		}
		return { status: false, message: `Switch to @${username} to logout` };
	}
	return { status: false, message: 'User not found', otherUsers: storedUsers.length === 1 ? false : true };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateId = () => {
	const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
	const machineId = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
	const processId = Math.floor(Math.random() * 65535).toString(16).padStart(4, '0');
	const counter = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
	
	return timestamp + machineId + processId + counter;
}

export class Time {
	time: string;
	
	constructor(time?: string) {
		this.time = time || '';
    }

    static formatNo(no: number) {
        if (no >= 1000000) {
            return (no / 1000000).toFixed(1) + 'M';
        } else if (no >= 1000) {
            return (no / 1000).toFixed(1) + 'K';
        } else {
            return no.toString();
        }
    }

    format(time?: string) {
        const dateObj = new Date((time ? time : this.time));
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        };
        return dateObj.toLocaleString('en-US', options);
    }

    formatMoment(time?: string) {
        const date = moment((time ? this.format(time) : this.format(this.time)), 'MM/DD/YYYY, h:mm:ss A');
        return date.format('MMM D, YYYY h:mm:ss A');
    }

	updateLiveTime(response: ResponseType, responseTime?: string): string {
		if(response !== "countdown" && response !== "getlivetime" && response !== "chat-time") {
			throw new Error("Invalid response type. Expected 'countdown' or 'getlivetime' or 'chat-time'.");
		}
		const availableTime = responseTime ? responseTime : this.time

		const time = new Date(availableTime).getTime();
		const now = new Date().getTime();

        if (response === "chat-time") {
            const timeObj = new Date(this.time);
            return timeObj.toLocaleString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
            });
        }

        const distance = response === "countdown" ? time - now : now - time;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days > 0) {
            const date = this.format(availableTime ? availableTime : this.time);
            return date;
        } else if (hours > 0) {
            return `${hours}${hours === 1 ? " hr" : " hrs"}`;
        } else if (minutes > 0) {
            return `${minutes}${minutes === 1 ? " min" : " mins"}`;
        } else {
            return `${seconds}${seconds === 1 ? " sec" : " secs"}`;
        }
    }
}