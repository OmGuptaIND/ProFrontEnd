import NavBar from "../components/NavBar"
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{data}] = usePostsQuery();
  return (
    <>
      <NavBar />
      <p>this is home</p>
      <br />
      {!data ? <div>Loading...</div>: (data.posts.map(doc => <div key = {doc.id} >{doc.title}</div>))}
    </>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
