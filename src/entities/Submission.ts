import { prop as Property } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import { AbstractPost } from './AbstractPost';
import { Edit } from './Edit';
import { Reply } from './Reply';

@ObjectType()
export class Submission extends AbstractPost {
  @Property({
    type: () => Reply
  })
  @Field(() => Reply)
  replies!: Reply[];

  @Property({
    type: () => Edit
  })
  @Field(() => Edit)
  edits!: Edit[];
}
