import React from 'react';
import Link from 'next/link';
import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';

const Item = (props) => {
  const { item } = props;
  return (
    <ItemStyles>
      <Title>
        <Link href={{
          pathname: '/item',
          query: { id: item.id }
        }}>
          <a>{item.title}</a>
        </Link>
      </Title>
      {item.image && <img src={item.image} alt={item.title} />}
      <PriceTag>{formatMoney(item.price)}</PriceTag>
      <p>{item.description}</p>
      <div className="buttonList">
        <Link href={{
          pathname: '/update',
          query: { id: item.id }
        }}>
          <a>Edit</a>
        </Link>
        <button>Add to cart</button>
        <button>Delete</button>
      </div>
    </ItemStyles>
  )
}

export default Item;
