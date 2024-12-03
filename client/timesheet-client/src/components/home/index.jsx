import { useAuth } from '../../contexts/authContext';

const Home = () => {
    const { currentUser } = useAuth();

    // Check if currentUser exists before rendering content
    if (!currentUser) {
        return <div className="text-2xl font-bold pt-14">Please log in</div>; // Display a message when user is logged out
    }

    return (
        <div className='text-2xl font-bold pt-14'>
            Hello {currentUser.displayName || currentUser.email}, you are now logged in.
        </div>
    );
};

export default Home;
