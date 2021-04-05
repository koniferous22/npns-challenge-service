import { prop as Property } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import { AbstractPost } from './AbstractPost';
import { Edit } from './Edit';

@ObjectType()
export class Reply extends AbstractPost {
  @Property({
    type: () => Edit
  })
  @Field(() => Edit)
  edits!: Edit[];
}
