import Form from 'next/form';
import { submitSurveyResponse } from '@/app/actions';

export default function Home() {
  return (
    <Form action={submitSurveyResponse}>
      <input name="title" />
      <button type="submit">Create Post</button>
    </Form>
  );
}
