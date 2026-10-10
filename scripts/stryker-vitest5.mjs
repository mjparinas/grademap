// Stryker's Vitest runner (10.0.0) filters a mutant's tests by name, joining suite and test names
// with a space. Vitest 5 matches names as "suite > test", so the filter matches nothing and every
// mutant "survives" with 0 tests run. This runner keeps the per-test coverage but runs each covering
// test file whole. Drop it once @stryker-mutator/vitest-runner supports Vitest 5.
import { declareFactoryPlugin, PluginKind } from "@stryker-mutator/api/plugin";
import { determineHitLimitReached, toMutantRunResult } from "@stryker-mutator/api/test-runner";
import { strykerPlugins as vitestPlugins } from "@stryker-mutator/vitest-runner";

const vitestFactory = vitestPlugins.find((plugin) => plugin.name === "vitest").factory;

function createRunner(injector) {
  const runner = injector.injectFunction(vitestFactory);
  runner.mutantRun = async (options) => {
    runner.ctx.provide("mode", "mutant");
    runner.ctx.provide("hitLimit", options.hitLimit);
    runner.ctx.provide("mutantActivation", options.mutantActivation);
    runner.ctx.provide("activeMutant", options.activeMutant.id);
    const testFiles = options.testFilter && [...new Set(options.testFilter.map((id) => id.split("#")[0]))];
    const result = await runner.run({ testFiles, relatedFiles: [options.sandboxFileName] });
    const timeOut = determineHitLimitReached(runner.readHitCount(), options.hitLimit);
    return toMutantRunResult(timeOut ?? result);
  };
  return runner;
}
createRunner.inject = ["$injector"];

export const strykerPlugins = [declareFactoryPlugin(PluginKind.TestRunner, "vitest5", createRunner)];
