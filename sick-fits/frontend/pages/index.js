import Link from 'next/link';
import Items from '../components/Items';

const Home = (props) => {
  const page = parseFloat(props.query.page) || 1
  return (
    <div>
      <Items page={page} />
    </div>
  )
};

export default Home;
