const Professional = use('App/Models/Professional');
const Permission = use('App/Models/Permission');

class Role {

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth, request, response }, next) {

    let url = request.url();
    const method = request.method();
    const parts = url.split('/');
    const last = parts[parts.length - 1];
    if (last.match('\\d')) {
      url = url.replace(`/${last}`, '/:id');
    }
    const {professional} = request
 
    if(professional.roleId){

      
      const hasPermission = await Permission.query()
      .innerJoin('role_permissions', 'permissions.id', 'role_permissions.permission_id')
      .where('role_permissions.role_id', professional.roleId)
      .andWhere('permissions.url', url)
      .andWhere('permissions.method', method)
      .first();
      if (!hasPermission) {
        return response.unauthorized({
          message: 'No tienes los suficientes permisos',
        });
      }
    }

    await next();
  }

}

module.exports = Role;
