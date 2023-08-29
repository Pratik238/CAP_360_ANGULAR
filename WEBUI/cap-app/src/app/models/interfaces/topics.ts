export interface ITopics {
  TopicId?: string;
  TopicName?: string;
  TopicURL?: string;
  IsActive?: number;
  Createdby?: string;
  Updatedby?: string;
  CreatedDate?: string;
  UpdatedDate?: string;
}

export interface ISubTopics {
  subTopicId?: string;
  subTopicName?: string;
  subTopicUrl?: string;
  topicId?: string;
  isActive?: number;
  Createdby?: string;
  Updatedby?: string;
  CreatedDate?: string;
  UpdatedDate?: string;
}
