import { Helmet } from "react-helmet-async";

const Payments = () => {
  return (
    <section>
      <Helmet>
        <title>DevManage – Payments</title>
        <meta name="description" content="Record and track payments in DevManage." />
        <link rel="canonical" href="/payments" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-2">Payments</h1>
      <p className="text-muted-foreground">Payment records and invoicing tools are coming soon.</p>
    </section>
  );
};

export default Payments;
