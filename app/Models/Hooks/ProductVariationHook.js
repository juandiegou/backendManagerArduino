const Database= use('Database');
const ProductVariation= use('App/Models/ProductVariation');
const ProductSale= use('App/Models/ProductSale');
const DistribucionNormal = use ('App/Util/DistribucionNormal');
const RequestVariation = use('App/Models/RequestVariation');
const Provider = use('App/Models/Provider');
const ProductIncome = use('App/Models/ProductIncome');

const ProductVariationHook = exports = module.exports = {}

ProductVariationHook.dailyDemand = async (modelInstance) => {
   
  if(modelInstance.id){

  const DAYS_BEFORE = 30;
    const daysWorking = await Database.raw(`
    select count(total) as total from(SELECT  count(DATE(created_at)) as total FROM product_sales
    where created_at>DATE_ADD(NOW(), INTERVAL -${DAYS_BEFORE} DAY) 
    group by  DATE(created_at)) as a
    `);

  
    let providerId = await RequestVariation.query()
    .innerJoin('order_requests','order_requests.id','request_variations.order_request_id')
    .where({variation_id: modelInstance.id})
    .groupBy('provider_id')
    .orderBy('order_requests.created_at', 'desc')
    .select('provider_id')
    .first();
    let leadTime=0;
    let stdLeadTime=0;

    if(!providerId){
      providerId = await ProductIncome.query()
        .where({product_variation_id:modelInstance.id})
        .groupBy('provider_id')
        .orderBy('created_at', 'desc')
        .select('provider_id')
        .first();
    }

    if(providerId){
      const provider = await Provider.find(providerId.provider_id);        
      leadTime =provider.lead_time;
      stdLeadTime =provider.std_lead_time;
      modelInstance.provider_id = providerId.provider_id;
    }
        
      //días laborales en un periodo de 30 días
      const dailySalesQuery = await ProductSale.query()  // Ventas diarias de los ultimos 30 días
      .where({product_variation_id:modelInstance.id})
      .andWhere(Database.raw(`created_at>DATE_ADD(NOW(), INTERVAL -${DAYS_BEFORE} DAY)`))
      .select(Database.raw(`sum(quantity)/${daysWorking[0][0].total} as total`))
      .first();


      const stdDailySalesQuery = await Database.raw(`select std(ventas_dia.total_sales) as total 
      from (
        SELECT calendar.datefield AS date,
        IFNULL(SUM(ps.quantity),0) AS total_sales
        FROM (
          select * from product_sales where product_variation_id=28) as ps 
        RIGHT JOIN (
          SELECT  (DATE(created_at)) as datefield FROM product_sales
          where created_at>DATE_ADD(NOW(), INTERVAL -30 DAY)
          group by  DATE(created_at )
          )as calendar 
        ON (DATE(ps.created_at) = calendar.datefield)
        WHERE (calendar.datefield BETWEEN (SELECT MIN(DATE(created_at)) FROM product_sales) AND (SELECT MAX(DATE(created_at)) FROM product_sales) ) 
        GROUP BY date ) as ventas_dia
      `)
        //  modelInstance.daily_sales_temp = dailySalesQuery.total;
        // modelInstance.std_daily_sales = stdDailySales[0][0].total;
          const stdDailySales = stdDailySalesQuery[0][0].total;
          const dailySales = dailySalesQuery.total;
          const za =DistribucionNormal.getResult(95)
          const sc = Math.sqrt(
            (leadTime * Math.pow(stdDailySales,2))+ (Math.pow(dailySales,2)*Math.pow(stdLeadTime,2))
          )
          const rop = (dailySales*leadTime) + (za*sc);

          const ss = sc*za;
          modelInstance.safety_stock = ss;
          modelInstance.rop = rop;
          modelInstance.daily_sales = dailySales;
        }
}
