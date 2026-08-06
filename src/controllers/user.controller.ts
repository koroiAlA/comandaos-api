import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import User from '../models/User.model';

// Listar todos los usuarios (sin mostrar el password)
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Actualizar un usuario (nombre, rol, etc — no password aquí)
export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updated = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    ).select('-password');

    if (!updated) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// Eliminar un usuario
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    next(error);
  }
};