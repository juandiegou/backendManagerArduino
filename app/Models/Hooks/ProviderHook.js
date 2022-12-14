

const Provider = use('App/Models/Provider');
const OrderRequest = use('App/Models/OrderRequest');
const Database = use('Database');


const ProviderHook = exports = module.exports = {}

ProviderHook.LeadTime = async (modelInstance) => {

  const lt = await OrderRequest.query()
  .where({provider_id: modelInstance.provider_id })
  .andWhere(Database.raw(`(finish_at-emit_at)<10`))
  .select(Database.raw(`avg(finish_at-emit_at) as total`))
  .first();

  const stdLt = await OrderRequest.query()
  .where({provider_id: modelInstance.provider_id })
  .andWhere(Database.raw(`(finish_at-emit_at)<10`))
  .select(Database.raw(`std(finish_at-emit_at) as total`))
  .first();
  const  provider = await Provider.find(modelInstance.provider_id);
  provider.lead_time= lt.total;
  provider.std_lead_time= stdLt.total;
  await provider.save();

}


