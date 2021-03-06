import { ApiResponse } from '../services/api/api-convention';
import { Observable } from 'rxjs';
import { AuthServiceImpl } from './auth-service';
import { map } from 'fp-ts/lib/Either';
import { ApiProvider } from '../services/api/bind-api';
import { ItemCollectionDto, UserCollectionListDto } from '../services/api-generated/models';
import { launderResponse } from '../services/api/launder-api-response';
import { ObjLike } from '../util/types';

const mappers = {
  unResObject: map((resBody: UserCollectionListDto) => resBody.collections),
} as const;

export class CollectionServiceImpl {
  constructor(private useApi: ApiProvider, private readonly auth: AuthServiceImpl) {}

  saveCollections(collections: ItemCollectionDto[]): ApiResponse<ItemCollectionDto[]> {
    return this.auth
      .withAuthedIdentity((currentUser, authHeader) =>
        launderResponse(
          this.useApi(authHeader).momoUserControllerPutCollectionsRaw({
            userId: currentUser.userId,
            userCollectionListDto: { collections },
          }),
        ),
      )
      .then(mappers.unResObject);
  }

  fetchOwnCollections(): ApiResponse<ItemCollectionDto[]> {
    return this.auth
      .withAuthedIdentity((user, authHeader) =>
        launderResponse(
          this.useApi(authHeader).momoUserControllerGetCollectionsRaw({
            userId: user.userId,
          }),
        ),
      )
      .then(mappers.unResObject);
  }

  fetchCollections(userId: string): ApiResponse<ItemCollectionDto[]> {
    return this.auth
      .withAuthedIdentity((user, authHeader) =>
        launderResponse(
          this.useApi(authHeader).momoUserControllerGetCollectionsRaw({
            userId,
          }),
        ),
      )
      .then(mappers.unResObject);
  }
  observeCollections(itemName: string): Observable<ObjLike> {
    throw 'todo';
  }
}
