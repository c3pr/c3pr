function handleToolInvocation(toolInvocation) {

    console.log(`[${toolInvocation.meta.correlationId}] >>> C3PR Agent received invocation with args: ${JSON.stringify(toolInvocation, null, 2)}`);

}

module.exports = handleToolInvocation;