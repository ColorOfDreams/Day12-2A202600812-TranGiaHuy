export const runtimeState = {
  instanceId: process.env.INSTANCE_ID || `next-${Math.random().toString(36).slice(2, 10)}`,
  startedAt: new Date().toISOString(),
}

export function runtimeStatus() {
  return {
    instanceId: runtimeState.instanceId,
    startedAt: runtimeState.startedAt,
    uptimeSeconds: Math.round(process.uptime()),
    stateless: true,
  }
}
