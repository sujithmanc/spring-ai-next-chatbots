import { Home, User, Clapperboard, Users, Bookmark, Joystick, Notebook, BotIcon } from 'lucide-react';

export const ROUTES = [
    {
        path: '/demo',
        label: 'Demo',
        Icon: User, // Changed to generic User for example
        description: 'Just to check loading states'
    },
    {
        path: '/emps',
        label: 'Employee',
        Icon: User, // Changed to generic User for example
        description: 'Manage employee records and payroll.'
    },
    {
        path: '/movies',
        label: 'Movies',
        Icon: Clapperboard,
        description: 'Browse the latest movies and cinema times.'
    },
    {
        path: '/users',
        label: 'Users',
        Icon: Users,
        description: 'System administration and user roles.'
    },
    {
        path: '/bookmarks',
        label: 'Bookmarks',
        Icon: Bookmark,
        description: 'All the bookmarked Websites'
    },
    {
        path: '/games',
        label: 'Games',
        Icon: Joystick,
        description: 'All the games List'
    },
    {
        path: '/qanotes',
        label: 'QA Notes',
        Icon: Notebook,
        description: 'Learning throught Questions and Answers'
    },
    {
        path: '/chatbot',
        label: 'Chatbot',
        Icon: BotIcon,
        description: 'Interactive chatbot for user assistance'
    }
];