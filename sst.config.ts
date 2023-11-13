import { env } from "~/env.mjs";
import { type SSTConfig } from "sst";
import { NextjsSite, Api } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "tourgenie-next14",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const api = new Api(stack, "api", {
        customDomain: {
          domainName: "api.tourgenie.xyz",
          hostedZone: "tourgenie.xyz",
        },
      });
      const site = new NextjsSite(stack, "site", {
        customDomain: {
          domainName: "tourgenie.xyz",
          domainAlias: "www.tourgenie.xyz",
          hostedZone: "tourgenie.xyz",
        },
        environment: { ...env },
        bind: [api],
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
