import { User } from '../../@core/entities/User.entity';
import { IUsuarioPendentes } from '../../@core/interfaces/IUsuarioPendentes';

export class UsuarioPendentesMemoriaRepository implements IUsuarioPendentes {
  usuarios: Record<string, User> = {};

  add(token: string, user: User): Promise<void> {
    this.usuarios[token] = user;
    return Promise.resolve();
  }

  get(token: string): Promise<User> {
    return Promise.resolve(this.usuarios[token]);
  }

  remove(token: string): Promise<void> {
    delete this.usuarios[token];
    return Promise.resolve();
  }
}
