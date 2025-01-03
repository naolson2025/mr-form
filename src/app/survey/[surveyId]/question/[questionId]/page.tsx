import Form from 'next/form'

export default function Home() {
  return (
    <Form action={createPost}>
    <input name="title" />
    {/* ... */}
    <button type="submit">Create Post</button>
  </Form>
  );
}
